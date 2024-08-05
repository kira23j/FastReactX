from fastapi import APIRouter
from models.blog_m import BlogModel 

blog_root=APIRouter()

# post Request
@blog_root.post("/new/blog")
def new_blog(doc:BlogModel):
    doc=dict(doc)
    return doc

    
    