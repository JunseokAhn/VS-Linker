"""
데이터 모델 정의
"""

class User:
    """사용자 모델"""

    def __init__(self, name: str, age: int, email: str):
        self.name = name
        self.age = age
        self.email = email

    def __str__(self):
        return f"User({self.name}, {self.age}, {self.email})"
