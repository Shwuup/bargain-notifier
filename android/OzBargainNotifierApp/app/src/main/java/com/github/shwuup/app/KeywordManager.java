package com.github.shwuup.app;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class KeywordManager extends FileManager {

    KeywordManager(Context newContext) {
        super(newContext);
    }

    private File getKeywordFile() {
        Context context = this.context;
        File file = new File(context.getFilesDir(), "keywords");
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }

    public boolean deleteKeywordFile() {
        File file = getKeywordFile();
        boolean deleted = file.delete();
        return deleted;
    }

    public List<Keyword> readKeywords() {
        File file = getKeywordFile();
        String json = readFile(file);
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        List<Keyword> keywords = gson.fromJson(json, new TypeToken<List<Keyword>>() {
        }.getType());
        if (keywords == null) {
            return new ArrayList<>();
        } else {
            return keywords;
        }
    }

    public void deleteKeyword(final String keywordToDelete) {
        List<Keyword> keywords = readKeywords();
        keywords.removeIf(k -> k.keyword.equals(keywordToDelete));
        writeKeywords(keywords);
    }

    public List<Keyword> deserializeKeywords(JSONArray jsonArray) {
        ArrayList<Keyword> keywordObjects = new ArrayList<>();
        try {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                Keyword keyword = deserializeKeyword(obj);
                keywordObjects.add(keyword);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return keywordObjects;
    }

    public Keyword deserializeKeyword(JSONObject jsonObject) throws JSONException {
        ArrayList<Offer> offers = deserializeOffers(jsonObject.getJSONArray("offers"));
        String newKeyword = jsonObject.getString("keyword");
        boolean newIsOnFrontPage = jsonObject.getBoolean("isOnFrontPage");
        boolean newHasUserClicked = jsonObject.getBoolean("hasUserClicked");
        Keyword keyword = new Keyword(newKeyword, offers, newHasUserClicked, newIsOnFrontPage);
        return keyword;
    }

    private ArrayList<Offer> deserializeOffers(JSONArray jsonArray) {
        ArrayList<Offer> offers = new ArrayList<>();
        try {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject o = jsonArray.getJSONObject(i);
                Offer offer = new Offer(o.getString("url"), o.getString("title"));
                offers.add(offer);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return offers;
    }


    private void writeKeywords(List<Keyword> keywords) {
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        File file = getKeywordFile();
        writeFile(file, gson.toJson(keywords));
    }

    public void addKeyword(String keyword) {
        Keyword newKeyword = new Keyword(keyword);
        List<Keyword> keywords = readKeywords();
        keywords.add(newKeyword);
        writeKeywords(keywords);
    }

    public void deleteAll() {
        writeKeywords(new ArrayList<Keyword>());
    }
}
