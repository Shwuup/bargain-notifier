package com.github.shwuup.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.github.shwuup.R;

import java.util.List;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {
    private List<Keyword> keywords;

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView textView;

        public MyViewHolder(View v) {
            super(v);
            textView = v.findViewById(R.id.keyword);
        }
    }

    public MyAdapter(List<Keyword> keywords) {
        this.keywords = keywords;
    }

    @Override
    public MyAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item_view, parent, false);
        MyViewHolder vh = new MyViewHolder(v);
        return vh;
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

    public void delete(String keywordToDelete) {
        this.keywords.removeIf(k -> k.keyword.equals(keywordToDelete));
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
