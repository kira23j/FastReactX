from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()

origins=[
    "http://localhost:3000",
    "localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"] 
)

# get route
@app.get("/",tags=["root"])
async def read_root()->dict:
    return {"message":"welcome to fastapi"}


todos=[
    {"id":"1",
     "item":"something 1"
        },
  {"id":"2",
     "item":"something 2"
        },
  {"id":"3",
     "item":"something 3"
        },
]
# get todo route
@app.get("/todo",tags=["todos"])
async def get_todos()->dict:
    return {"data":todos}