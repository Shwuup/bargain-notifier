package com.github.shwuup.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.work.Constraints;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.github.shwuup.R;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity {
    public static final String EXTRA_MESSAGE = "com.github.shwuup.app.MESSAGE";
    private KeywordManager keywordManager;
    private NotificationManager notificationManager;
    private RecyclerView recyclerView;
    private MyAdapter mAdapter;
    private LinearLayoutManager layoutManager;
    private EditText editText;


    private void setListeners() {
        editText = findViewById(R.id.editText);
        editText.setOnFocusChangeListener((view, hasFocus) -> {
            if (!hasFocus) {
                editText.setText(R.string.edit_message);
            } else {
                editText.setText("");
            }
        });

        editText.setOnEditorActionListener((view, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_GO) {
                onAdd();
                return true;
            } else {
                return false;
            }
        });
    }

    public void showConfirmationForDeleteAll(View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Confirmation");
        builder.setMessage("Are you sure you want to delete all keywords?");

        builder.setPositiveButton("Delete", (dialog, id) -> onDeleteAll());
        builder.setNegativeButton("Cancel", (dialog, id) -> {
            dialog.cancel();
        });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar myToolbar = findViewById(R.id.toolbar);
        setListeners();
        notificationManager = (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);
        this.keywordManager = new KeywordManager(getApplicationContext());
//        keywordManager.deleteKeywordFile();
        createNotificationChannel();
        setSupportActionBar(myToolbar);
        List<Keyword> keywords = keywordManager.readKeywords();
        Log.v("MainActivity", keywords.toString());
        recyclerView = findViewById(R.id.my_recycler_view);
        layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        mAdapter = new MyAdapter(keywords);
        recyclerView.setAdapter(mAdapter);
        apiCall();
    }

    public void apiCall() {
        Constraints constraints = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        OneTimeWorkRequest firstTimeRequest = new OneTimeWorkRequest.Builder(RequestWorker.class)
                .setConstraints(constraints)
                .setInitialDelay(3, TimeUnit.MINUTES)
                .build();
        PeriodicWorkRequest httpRequest = new PeriodicWorkRequest.Builder(RequestWorker.class, 15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .setInitialDelay(10, TimeUnit.MINUTES)
                .build();
        WorkManager.getInstance(getApplicationContext()).enqueue(firstTimeRequest);
        WorkManager.getInstance(getApplicationContext()).enqueue(httpRequest);

    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = notificationManager.getNotificationChannel(getString(R.string.channel_id));
            if (notificationChannel != null) {
                notificationManager.deleteNotificationChannel(getString(R.string.channel_id));
            }
            CharSequence name = getString(R.string.channel_name);
            String CHANNEL_ID = getString(R.string.channel_id);
            String description = getString(R.string.channel_description);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            channel.enableLights(true);
            channel.enableVibration(true);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
            channel.setSound(Uri.parse("android.resource://"
                    + getApplicationContext().getPackageName() + "/"
                    + R.raw.kaching), audioAttributes);

            notificationManager.createNotificationChannel(channel);
        }
    }

    public void addKeyword() {
        EditText editText = findViewById(R.id.editText);
        String keyword = editText.getText().toString().toLowerCase();
        if(keyword.equals("")) {


        } else {
            keywordManager.addKeyword(keyword);
            this.mAdapter.add(new Keyword(keyword));
            editText.getText().clear();
        }
    }

    public void onAdd(View view) {
        addKeyword();
    }

    public void onAdd() {
        addKeyword();
    }

    public void onDelete(View view) {
        ViewParent parent = view.getParent();
        ViewGroup parentView = (ViewGroup) parent;
        TextView text = null;
        for (int i = 0; i < parentView.getChildCount(); i++) {
            View child = parentView.getChildAt(i);
            if (!(child instanceof Button)) {
                text = (TextView) child;
            }
        }
        String keyword = text.getText().toString();
        this.keywordManager.deleteKeyword(keyword);
        this.mAdapter.delete(keyword);
    }

    public void onDeleteAll() {
        keywordManager.deleteAll();
        this.mAdapter.clear();
    }
}
