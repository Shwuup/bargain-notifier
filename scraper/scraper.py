from bs4 import BeautifulSoup
import requests
import boto3
import json




def get_deals(url):
    page = requests.get(url).content
    soup = BeautifulSoup(page, "html.parser")
    res = soup.find_all(class_="node node-ozbdeal node-teaser")
    dic = {}
    for elem in res:
        h2 = elem.find("h2", class_="title")
        link = "https://www.ozbargain.com.au/node/" + elem["id"].strip("node")
        dic[link] = h2["data-title"]
    return dic


def upload():
    deals = get_deals("https://www.ozbargain.com.au/")
    new_deals = get_deals("https://www.ozbargain.com.au/deals")
    s3 = boto3.resource("s3")
    s3.Bucket("cached-deals").put_object(Key="frontPageDeals", Body=json.dumps(deals))
    s3.Bucket("cached-deals").put_object(Key="newDeals", Body=json.dumps(new_deals))


def lambda_handler(event, context):
    upload()
    

