from typing import Optional, List, Dict, Any, Union, Tuple
from pydantic import BaseModel, Field
import json
def formatQuery(user_information:BaseModel)->dict:
    """Takes in user information and formats it to a query, depending if the keys exist or not
    user_info must contain the following keys:
            name: str,
            concerns:str,
            needs:Optional[str] = None,
            lifestyle:Optional[str] = None,
    returns:
        queries: dict
            user_query (str): query to be used for LLM
            pinecone_query (str): query to be used for pinecone
    """
    # Convert to dict
    user_information = user_information.model_dump()
    print('user_information: ', user_information)

    # Check if value for name key exists
    if not user_information.get("name") or not user_information.get("concerns"):
        raise ValueError("Name or concerns key must exist in user_information")

    FINAL_QUERY_TEMPLATE = """My customer's name is {name}. He is primarily concerned about the following:\n{concerns}\n\n | With regards to the above information, how do we address his concerns?"""
    PINECONE_QUERY_TEMPLATE = """{concerns}|"""

    # If needs are
    NEEDS_TEMPLATE = """Additionally, he needs the following:\n{needs}\n"""
    LIFESTYLE_TEMPLATE = """He also has the following lifestyle:\n{lifestyle}\n"""

    # Check if needs key exists
    if user_information.get("needs"):
        # Find the | charater and add the needs template
        needs_index = FINAL_QUERY_TEMPLATE.find("|")
        FINAL_QUERY_TEMPLATE = FINAL_QUERY_TEMPLATE[:needs_index] + NEEDS_TEMPLATE.format(needs=user_information['needs']) + FINAL_QUERY_TEMPLATE[needs_index:]

        # Add the needs to the pinecone query
        needs_index2 = PINECONE_QUERY_TEMPLATE.find("|")
        PINECONE_QUERY_TEMPLATE = PINECONE_QUERY_TEMPLATE[:needs_index2] + NEEDS_TEMPLATE.format(needs=user_information['needs']) + PINECONE_QUERY_TEMPLATE[needs_index2:]
    
    # Check if lifestyle key exists
    if user_information.get("lifestyle"):
        # Find the | charater and add the needs template
        lifestyle_index = FINAL_QUERY_TEMPLATE.find("|")
        FINAL_QUERY_TEMPLATE = FINAL_QUERY_TEMPLATE[:lifestyle_index] + LIFESTYLE_TEMPLATE.format(lifestyle=user_information['lifestyle']) + FINAL_QUERY_TEMPLATE[lifestyle_index:]

        # Add the lifestyle to the pinecone query
        lifestyle_index2 = PINECONE_QUERY_TEMPLATE.find("|")
        PINECONE_QUERY_TEMPLATE = PINECONE_QUERY_TEMPLATE[:lifestyle_index2] + LIFESTYLE_TEMPLATE.format(lifestyle=user_information['lifestyle']) + PINECONE_QUERY_TEMPLATE[lifestyle_index2:]

    # Format the query
    user_query = FINAL_QUERY_TEMPLATE.format(name=user_information['name'],concerns=user_information['concerns'])

    # Format the pinecone query
    pinecone_query = PINECONE_QUERY_TEMPLATE.format(concerns=user_information['concerns'])

    return {
        "user_query":user_query,
        "pinecone_query":pinecone_query
    }


def parse_json_output(output):
    """Parse the json output from the openai ChatCompletionMessage"""

    try:
        json_ouput = output.function_call.arguments
        json_ouput = json.loads(json_ouput)
        return json_ouput
    except Exception as e:
        print(e)
    
    return ""
