from fastapi import APIRouter

entry_root=APIRouter()
@entry_root.get("/")
def apiRunning():
    res={
        "status":"ok",
        "message":"api is running"
    }