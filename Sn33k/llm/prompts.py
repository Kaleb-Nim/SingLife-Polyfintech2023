PDF_CONTEXT_SUMMARIZER_PROMPT = """Goal: Read the PDF information,understand it and summarize the pdf to account for specific target audience\n
Rules:
1. What kind of needs and concerns does this PDF address?
2. Who is the target audience for this PDF?
3. How does it help the target audience with relation to their lifestyle/needs/concerns?
4. What specific service name does this pdf contain, if any?
5. Prime Example of a persona needs/concerns jobs that will find this PDF extremely useful, state the persona needs/concerns age and lifestyle etc.

PDF Information:
{pdf_information}
"""