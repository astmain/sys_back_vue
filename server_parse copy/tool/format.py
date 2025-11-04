# -*- coding: utf-8 -*-

red = "\033[91m"
green = "\033[92m"
yellow = "\033[93m"
blue = "\033[94m"
purple = "\033[95m"
cyan = "\033[96m"
gray = "\033[90m"
end = "\033[0m"


def format(*args, color="", space=20, placeholder=" "):
    # print("111---222:", *args)
    # print("111---222:", args.)
    # print("111---222:", f'333'.ljust(20, ' '), f'333'.ljust(20, ' '))
    result = ""
    for ele in args:
        # result += str(ele).ljust(space, ' ')
        result += str(ele).ljust(space, placeholder)
        # result += str(ele)
    if color == "red":     result = red + result + "\033[0m"
    if color == "green":   result = green + result + "\033[0m"
    if color == "yellow":  result = yellow + result + "\033[0m"
    if color == "blue":    result = blue + result + "\033[0m"
    if color == "purple":  result = purple + result + "\033[0m"
    if color == "gray":    result = gray + result + "\033[0m"
    if color == "cyan":    result = cyan + result + "\033[0m"
    return result


if __name__ == '__main__':
    print("111---222:", format("main1", 2222, color="red", space=20, placeholder="="))
