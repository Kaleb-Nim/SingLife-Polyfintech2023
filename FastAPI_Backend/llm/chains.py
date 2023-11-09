import openai
from dotenv import load_dotenv
import os
from .prompts import VIDEO_SCRIPT_PROMPT,VIDEO_SCRIPT_JSON_OUTPUT
print(load_dotenv('../.env'))

openai.api_key = os.getenv("OPENAI_API_KEY")


def chat(relevant_documents:str,query:str):

    prompt = VIDEO_SCRIPT_PROMPT.format(query=query,relevant_documents=relevant_documents,VIDEO_SCRIPT_JSON_OUTPUT=VIDEO_SCRIPT_JSON_OUTPUT)
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return completion.choices[0].message

if __name__ == "__main__":
    chat(relevant_documents="""Have two or more of your biological parents, brothers or sisters ever been diagnosed with cancer before age 50?\nIf Yes, please complete the following:\nAssured / Life Assured\nType of cancer Relationship Age at Age at death\ndiagnosis (if deceased)\nPSDEC004.08 (042023) Page 7 of 11\nSingapore Life Ltd. 4 Shenton Way #01-01 SGX Centre 2 Singapore 068807 • Tel: (65) 6827 9933 singlife.com\nCompany Reg. No. 196900499K GST Reg. No. MR8500166-8 10. SINGLIFE SIMPLE TERM\nLife Assured\nFor Singlife Simple Term\nYes No\n1. What is your height and weight? Height (m) :\nWeight (kg) :\n2. Are you a smoker? If Yes, how many sticks of cigarettes do you smoke per day in the last 12 months? (including social\nsmokers, cigar smokers or those who have given up within the last 12 months)\nSticks per day\n3. Have you ever had or been treated for:\na. Cancer or Carcinoma-in-situ,\nb. Chest pain, heart attack or coronary heart disease,\nc. Stroke or transient ischaemic attack,\nd. Diabetes,\ne. Chronic kidney disease\nf. Arthritis?\n4. In the last 5 years, have you had:\na. Blood disorder\nenvironmental or human losses, such as avalanche, earthquake, flood, forest fire,\nhurricane, landslides, lightning, tornado, tsunami, typhoon or volcanic eruption.\nChild Persons under 18 years old or persons from 18 years old up to 23 years old who are\nstudying full-time in a recognised institute of higher learning and are not married,\nwho are biologically or legally related to an adult who is named in Your Schedule.\nWe determine the age as at the date of policy inception with reference to the date\nof birth.\nClose Business Associate Someone You work with in Singapore who has to be at work in order for You to be\nable to go on or continue a Trip. A senior manager or director of the business must\nconfirm this.\nClose Relative Your mother, father, sister, brother, legal partner or partner who lives with You,\nfiancé(e), daughter, son, grandparent, grandchild, parent-in-law, daughter-in-law,\nson-in-law, brother-in-law, sister-in-law, step-parent, step-child, step-sister, step-brother,\naunt, uncle, cousin, nephew, niece, legal guardian or foster child.\nDepreciation Scale The depreciation scale set out below which applies for any sports equipment including\nGolfing Equipment, Water Sports Equipment and Winter Sports Equipment that\nYou bring on a Trip.\n• Up to one year old, 90% of the purchase price.\n• Up to two years old, 70% of the purchase price.\n• Up to three years old, 50% of the purchase price.\n• Up to four years old, 30% of the purchase price.\n• Over four years old, 20% of the purchase price.\nDoctor A registered practising member of the medical profession with a recognised degree""",query="I have a family with two kids, what can I get")