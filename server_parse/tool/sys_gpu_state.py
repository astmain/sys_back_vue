import pynvml


def sys_gpu_state(gpu_index: int = 0):
    pynvml.nvmlInit()
    result = {}
    try:
        handle = pynvml.nvmlDeviceGetHandleByIndex(gpu_index)
        info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        result = {
            "success": True,
            "msg": f"成功:查询gpu-{gpu_index}运行状态",
            "err": "",
            "gpu_index": gpu_index,
            "total": info.total / 1024 ** 2,
            "used": info.used / 1024 ** 2,
            "free": info.free / 1024 ** 2,
        }
    except Exception as error:
        result = {
            "success": False,
            "msg": f"失败:查询gpu-{gpu_index}运行状态",
            "err": error,
            "gpu_index": gpu_index,
            "total": 0,
            "used": 0,
            "free": 0,
        }

    finally:
        pynvml.nvmlShutdown()

    return result


if __name__ == "__main__":
    print("111---:", sys_gpu_state(0))
