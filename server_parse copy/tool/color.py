from dataclasses import dataclass


@dataclass
class color:
    red = "\033[91m"
    green = "\033[92m"
    yellow = "\033[93m"
    blue = "\033[94m"
    purple = "\033[95m"
    cyan = "\033[96m"
    end = "\033[0m"


if __name__ == '__main__':
    print(color.red, "红色---red", color.end)
