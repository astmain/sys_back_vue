from fastapi import APIRouter
import os

route = APIRouter()


@route.get("/test")
async def test(name: str = "xupeng"):
    return {"test": 111}


if __name__ == '__main__':
    pic_path = r'./111.png'
    file_path = r'static/111.stl'
    from pathlib import Path

    path1 = Path("/filestore_oss/public/1/111_2025-10_14_00_37_49_316032_new.png")

    ppp1 = "/filestore_oss/public/1/111_2025-10_14_00_37_49_316032_new.png"
    ppp2 = "/" + "/".join(ppp1.split("/")[2:])

    zzz = 1
