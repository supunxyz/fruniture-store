from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    billing_address: Optional[str] = None
    payment_card: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    billing_address: Optional[str] = None
    payment_card: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: str
    password: str

class OTPSendRequest(BaseModel):
    phone_number: str

class OTPVerifyRequest(BaseModel):
    phone_number: str
    otp: str

class UserCreateVerified(UserBase):
    password: str
    phone_number: str
    otp: str
