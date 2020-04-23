package com.github.shwuup.app;

import com.google.gson.Gson;

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

    public String serialize() {

        Gson gson = new Gson();
        String jsonString = gson.toJson(this);
        return jsonString;

    }


}
