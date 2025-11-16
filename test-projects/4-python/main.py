"""
Python Import 테스트
"""

from utils import format_name, calculate_age
from models import User

def main():
    # 사용자 생성
    user = User("홍길동", 30, "hong@example.com")

    # 유틸리티 함수 사용
    formatted_name = format_name(user.name)
    age_in_months = calculate_age(user.age)

    print(f"User: {formatted_name}")
    print(f"Age in months: {age_in_months}")
    print(f"Email: {user.email}")

if __name__ == "__main__":
    main()
