package com.github.shwuup.app;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class KeywordManagerTest {

    @Mock
    Context mockContext;

    @Test
    public void testDeserializeKeyword() {
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        KeywordManager km = new KeywordManager(mockContext);
        Keyword expectedKeyword = new Keyword("testKeyword");
        String actualJson = gson.toJson(expectedKeyword);
        try {
            Keyword actualKeyword = km.deserializeKeyword(new JSONObject(actualJson));
            assertEquals(actualKeyword, expectedKeyword);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testDeserializeKeywords() {
        KeywordManager km = new KeywordManager(mockContext);
        List<Keyword> expectedKeywords = new ArrayList<>();
        Keyword k1 = new Keyword("testKeyword", new ArrayList<Offer>(), false, true);
        Keyword k2 = new Keyword("testKeyword2", new ArrayList<Offer>(), false, true);
        expectedKeywords.add(k1);
        expectedKeywords.add(k2);
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        try {
            JSONArray jArray = new JSONArray(gson.toJson(expectedKeywords));
            List<Keyword> actualKeywords = km.deserializeKeywords(jArray);
            assertEquals(actualKeywords, expectedKeywords);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
