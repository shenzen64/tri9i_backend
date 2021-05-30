from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime


def saveInFile(txt):
    with open("test.txt", "a") as file:
        file.write(txt)


PATH = "C:\Program Files (x86)\chromedriver.exe"

options = webdriver.ChromeOptions()
options.add_argument(
    "--user-data-dir=C:\\Users\\zoagu\\AppData\\Local\\Google\\Chrome\\User Data\\Default")
options.add_argument("--profile-directory=Default")
driver = webdriver.Chrome(PATH)

driver.get("http://hades-presse.com/formations/grandes_ecoles_marocaines.shtml")

# time.sleep(25)
# meDiv = driver.find_element_by_xpath('//span[@title="{}"]'.format(username))
# meDiv.click()
# time.sleep(2)


# def sendMsg(msg):
#     global out
#     inputText = driver.find_element_by_class_name("_3uMse")
#     inputText.send_keys(msg)
#     time.sleep(2)
#     inputText.send_keys(Keys.RETURN)


# def checkOnLigne():

#     global d
#     global interval

#     try:
#         onLigne = driver.find_element_by_xpath(
#             '//span[@class="_7yrSq _3-8er selectable-text copyable-text"]')
#         if d == False:
#             nowS = datetime.now()
#             date_time_start = nowS.strftime("%m/%d/%Y, %H:%M:%S")
#             interval[0] = date_time_start
#             d = True
#             # if int(datetime.now().hour) < 12 :
#             sendMail()
#     except:
#         if d == True:
#             nowE = datetime.now()
#             date_time__end = nowE.strftime("%m/%d/%Y, %H:%M:%S")
#             interval[1] = date_time__end
#             saveInFile(interval)
#             d = False


# while True:
#     checkOnLigne()
#     # if out==True:
#     #     break
#     time.sleep(10)
schoolNames = driver.find_elements_by_css_selector('a h3')
schoolAdresses = driver.find_elements_by_css_selector('address')
for school in schoolAdresses:
    text = school.text.split('\n')
    if len(text) >= 3:
        f = school.text.replace('\n', '\t')
        ad = f"{f}  \n"
        saveInFile(ad)
    else:
        saveInFile('ERR\n')

print(len(schoolAdresses))
# print(schoolAdresses)
