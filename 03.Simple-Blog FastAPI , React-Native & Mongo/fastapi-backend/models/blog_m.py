from pydantic import BaseModel

class BlogModel(BaseModel):
    title:str
    sub_title:str
    content:str
    author:str
    tags:list

