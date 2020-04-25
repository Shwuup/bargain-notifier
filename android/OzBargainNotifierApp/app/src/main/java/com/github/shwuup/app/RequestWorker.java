package com.github.shwuup.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.shwuup.R;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static android.content.Context.NOTIFICATION_SERVICE;

public class RequestWorker extends Worker {
    private Context ctx;
    private KeywordManager keywordManager;
    private SeenDealsManager seenDealsManager;


    public RequestWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
        this.ctx = context;
        this.keywordManager = new KeywordManager(this.ctx);
        this.seenDealsManager = new SeenDealsManager(this.ctx);
    }

    private List<Notification> getNotifications(List<Offer> offers) {

        String CHANNEL_ID = ctx.getResources().getString(R.string.channel_id);
        String title = "OzBargain Notifier";
        String text;
        String GROUP_KEY_DEALS = "com.github.shwuup.app.DEALS";
        List<Notification> notifications = new ArrayList<Notification>();

        for (Offer offer : offers) {
            text = offer.title;
            Intent notificationIntent = new Intent(Intent.ACTION_VIEW);
            notificationIntent.setData(Uri.parse(offer.url));
            notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            PendingIntent pending = PendingIntent.getActivity(ctx, 0, notificationIntent, 0);
            Notification notification = new NotificationCompat.Builder(ctx, CHANNEL_ID)
                    .setGroup(GROUP_KEY_DEALS)
                    .setContentTitle(title)
                    .setContentText(text)
                    .setSmallIcon(R.drawable.notification_icon)
                    .setGroupSummary(false)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
                    .setContentIntent(pending)
                    .build();

            notifications.add(notification);
        }
        return notifications;
    }


    private void sendRequest() {
        RequestQueue queue = Volley.newRequestQueue(this.ctx);
        String url = "https://jqjhg6iepc.execute-api.ap-southeast-2.amazonaws.com/prod/bargain";
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        final JSONObject requestBody = new JSONObject();
        String keywordJson = gson.toJson(keywordManager.readKeywords());
        String seenDealsJson = gson.toJson(seenDealsManager.readSeenDeals());
        Log.v("RequestWorker", seenDealsJson);

        try {
            JSONArray keywords = new JSONArray(keywordJson);
            JSONObject seenDeals = new JSONObject(seenDealsJson);
            requestBody.put("keywords", keywords);
            requestBody.put("numberOfUnclickedKeywords", 0);
            requestBody.put("seenDeals", seenDeals);
            Log.v("RequestWorker", requestBody.toString());

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                    (Request.Method.POST, url, requestBody, new Response.Listener<JSONObject>() {

                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("RequestWorker", "Response: " + response.toString());
                            try {
                                List<Offer> offers = new ArrayList<>();
                                JSONArray j = response.getJSONArray("keywords");
                                List<Keyword> keywords = keywordManager.deserializeKeywords(j);
                                for (Keyword keyword : keywords) {
                                    List<Offer> keywordOffers = keyword.offers;
                                    if (!keywordOffers.isEmpty()) {
                                        offers.addAll(keywordOffers);
                                        seenDealsManager.writeSeenDeals(offers);
                                    }
                                }
                                if (!offers.isEmpty()) {
                                    List<Notification> notifications = getNotifications(offers);
                                    NotificationManager notificationManager = (NotificationManager) ctx.getSystemService(NOTIFICATION_SERVICE);
                                    StatusBarNotification[] activeNotifications = notificationManager.getActiveNotifications();

                                    for (int i = 0; i < notifications.size() - 1; i++) {
                                        Notification notification = notifications.get(i);
                                        Bundle extras = notification.extras;
                                        String id = extras.getString(Notification.EXTRA_TEXT);
                                        notificationManager.notify(id.hashCode(), notification);
                                    }
                                    if (activeNotifications.length == 0) {
                                        Notification bundleNotification = new NotificationCompat.Builder(ctx, ctx.getResources().getString(R.string.channel_id))
                                                .setSmallIcon(R.drawable.notification_icon)
                                                .setContentTitle("Bundled Notification")
                                                .setContentText("Content text for bundle")
                                                .setGroup("com.github.shwuup.app.DEALS")
                                                .setGroupSummary(true)
                                                .build();
                                        notificationManager.notify("Bundled Notification".hashCode(), bundleNotification);
                                    }


                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }, new Response.ErrorListener() {

                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // TODO: Handle error
                            Log.e("RequestWorker", "Request error");

                        }
                    });
            queue.add(jsonObjectRequest);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }


    @Override
    public Result doWork() {
        sendRequest();
        return Result.success();
    }


}
