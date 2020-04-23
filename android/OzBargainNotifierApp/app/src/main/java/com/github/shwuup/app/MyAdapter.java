package com.github.shwuup.app;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.github.shwuup.R;

import java.util.List;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {
    private List<Keyword> keywords;

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView textView;
        public MyViewHolder(TextView v) {
            super(v);
            textView = v;
        }
    }

    public MyAdapter(List<Keyword> keywords) {
        this.keywords = keywords;
    }

    @Override
    public MyAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        TextView v = (TextView) LayoutInflater.from(parent.getContext()).inflate(R.layout.my_text_view, parent, false);

        MyViewHolder vh = new MyViewHolder(v);
        return vh;

    }

    public void addAllItems(List<Keyword> keywords) {
        this.keywords.clear();
        this.keywords.addAll(keywords);
        notifyDataSetChanged();
    }

    public void clear() {
        int size = keywords.size();
        keywords.clear();
        notifyItemRangeRemoved(0, size);
    }

    public void add(Keyword keyword) {
        this.keywords.add(keyword);
        notifyDataSetChanged();
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        String keyword = keywords.get(position).keyword;
        holder.textView.setText(keyword);
    }

    @Override
    public int getItemCount() {
        return keywords.size();
    }

}