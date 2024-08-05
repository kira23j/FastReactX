from fastapi import FastAPI
from routes.entry import entry_root

app=FastAPI()
app.include_router(entry_root)