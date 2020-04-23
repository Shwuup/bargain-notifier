package com.github.shwuup.app;

import android.content.Context;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

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
        Log.v("FILE", json);
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        List<Keyword> keywords = gson.fromJson(json, new TypeToken<List<Keyword>>() {
        }.getType());
        if (keywords == null) {
            return new ArrayList<Keyword>();
        } else {
            return keywords;
        }
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
