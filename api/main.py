from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MF PRIME CLUB API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz", tags=["system"])
def health_check():
    return {"status": "ok"}


@app.get("/hero", tags=["content"])
def hero_content():
    return {
        "title": "MF PRIME CLUB",
        "accessLabel": "Доступ назавжди",
        "cta": {
            "primary": "Отримати доступ",
            "secondary": "Вступити до клубу",
        },
        "tagline": "no risk — no porsche",
        "description": (
            "Закритий простір для трейдерів і фаундерів, де обмінюємося робочими стратегіями, "
            "підтримуємо один одного та фіксуємо можливості ще до того, як їх помічає ринок."
        ),
        "benefits": [
            "📊 Живі сесії з розбором угод та управління ризиками",
            "🧠 Закритий чат без випадкових людей і без шуму",
            "🚀 Доступ до нових наративів першої хвилі та запусків",
        ],
    }


@app.get("/carousel", tags=["content"])
def carousel_logos():
    return {"logos": ["/1.png", "/2.png", "/3.png"], "interval": 3000}

