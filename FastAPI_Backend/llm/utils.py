from typing import Optional, List, Dict, Any, Union, Tuple
from pydantic import BaseModel, Field
import json

def parse_json_output(output):
    """Parse the json output from the openai ChatCompletionMessage"""

    try:
        json_ouput = output.function_call.arguments
        json_ouput = json.loads(json_ouput)
        return json_ouput
    except Exception as e:
        print(e)
    
    return ""
