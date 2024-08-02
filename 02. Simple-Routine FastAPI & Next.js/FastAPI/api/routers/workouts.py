from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException, status

from models import Workout
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/workouts",
    tags=["workouts"]
)

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkoutCreate(WorkoutBase):
    pass

@router.get("/{workout_id}")
def get_workout(db: db_dependency, user: user_dependency, workout_id: int):
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")
    return workout

@router.get("/")
def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency, user: user_dependency, workout: WorkoutCreate):
    db_workout = Workout(**workout.dict(), user_id=user.get('id'))
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not db_workout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")
    db.delete(db_workout)
    db.commit()
    return {"detail": "Workout deleted successfully"}
