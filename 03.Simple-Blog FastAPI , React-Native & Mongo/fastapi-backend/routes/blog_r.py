from fastapi import APIRouter
from models.blog_m import BlogModel 
from config.config import blogs_collection
import datetime

blog_root=APIRouter()

# post Request
@blog_root.post("/new/blog")
def new_blog(doc:BlogModel):
    doc=dict(doc)
    current_date=datetime.date.today()
    doc["date"]=str(current_date)
    res=blogs_collection.insert_one(doc)
    doc_id=str(res.inserted_id)
    return {
        "status":"ok",
        "message":"blog posted successfully",
        "_id":doc_id
    }
    

    
    