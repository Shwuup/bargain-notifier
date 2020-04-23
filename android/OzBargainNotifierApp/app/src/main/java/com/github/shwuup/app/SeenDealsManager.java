package com.github.shwuup.app;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SeenDealsManager extends FileManager {

    SeenDealsManager(Context newContext) {
        super(newContext);
    }

    private File getSeenDealsFile() {
        Context context = this.context;
        File file = new File(context.getFilesDir(), "seenDeals");
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }

    public boolean deleteSeenDealsFile() {
        File file = getSeenDealsFile();
        boolean deleted = file.delete();
        return deleted;
    }

    public void writeSeenDeals(Map<String, String> seenDeals) {
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        File file = getSeenDealsFile();
        writeFile(file, gson.toJson(seenDeals));
    }

    public void writeSeenDeals(List<Offer> offers) {
        Map<String, String> seenDeals = readSeenDeals();
        for (Offer offer : offers) {
            seenDeals.put(offer.url, offer.title);
        }
        writeSeenDeals(seenDeals);
    }

    public Map<String, String> readSeenDeals() {
        File file = getSeenDealsFile();
        String json = readFile(file);
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        Map<String, String> seenDeals = gson.fromJson(json, new TypeToken<HashMap<String, String>>() {
        }.getType());
        if (seenDeals == null) {
            return new HashMap<>();
        } else {
            return seenDeals;
        }
    }
}
