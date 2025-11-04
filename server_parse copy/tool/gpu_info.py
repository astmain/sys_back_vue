import pynvml

# 初始化 NVML
pynvml.nvmlInit()

# 获取 GPU 设备数量
device_count = pynvml.nvmlDeviceGetCount()

for i in range(device_count):
    # 获取指定索引的 GPU 设备句柄
    handle = pynvml.nvmlDeviceGetHandleByIndex(i)
    # 获取 GPU 显存信息
    info = pynvml.nvmlDeviceGetMemoryInfo(handle)
    print(f"GPU {i}:")
    print(f"  总显存: {info.total / 1024 ** 2:.2f} MiB")
    print(f"  已使用显存: {info.used / 1024 ** 2:.2f} MiB")
    print(f"  空闲显存: {info.free / 1024 ** 2:.2f} MiB")

# 关闭 NVML
pynvml.nvmlShutdown()