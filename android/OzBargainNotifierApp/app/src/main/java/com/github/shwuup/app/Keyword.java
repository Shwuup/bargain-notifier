package com.github.shwuup.app;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

public class Keyword {
    public String keyword;
    public ArrayList<Offer> offers = new ArrayList<>();
    public boolean hasUserClicked = false;
    public boolean isOnFrontPage = false;

    public Keyword(String newKeyword) {
        keyword = newKeyword;
    }

    public Keyword(String newKeyword, ArrayList<Offer> newOffers, boolean newHasUserClicked, boolean newIsOnFrontPage) {
        keyword = newKeyword;
        offers = newOffers;
        hasUserClicked = newHasUserClicked;
        isOnFrontPage = newIsOnFrontPage;
    }

    public void addOffer(String link, String description) {
        offers.add(new Offer(link, description));
    }

    @NonNull
    @Override
    public String toString() {
        GsonBuilder gsonB = new GsonBuilder();
        Gson gson = gsonB.create();
        return gson.toJson(this);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Keyword)) {
            return false;
        }
        String thisKeyword = this.toString();
        String otherKeyword = obj.toString();
        return thisKeyword.equals(otherKeyword);
    }

    @Override
    public int hashCode() {
        return this.keyword.hashCode();
    }
}
