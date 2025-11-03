import pyopencl as cl

# 获取OpenCL平台和设备列表并打印信息
platforms = cl.get_platforms()
for platform in platforms:
    print("Platform:", platform.name)
    devices = platform.get_devices()
    for device in devices:
        print("  Device:", device.name)
        print("  Type:", cl.device_type.to_string(device.type))
        print("  Compute Units:", device.max_compute_units)
        print("  Global Memory Size:", device.global_mem_size / (1024 ** 2), "MB")

