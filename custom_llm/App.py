import openai
import streamlit as st
from streamlit_chat import message
from utils.singlife import Singlife

# For displaying the output of print() in Streamlit
from contextlib import contextmanager, redirect_stdout
from io import StringIO


# Setting page title and header
st.set_page_config(page_title="AVA", page_icon=":robot_face:")
st.markdown("<h1 style='text-align: center;'>SINGen -Your personal video GPT 😬</h1>", unsafe_allow_html=True)

@st.cache_resource
def init_singlife_class():
    # Usually u just have to init with this line, werid streamlit thingy to cache 
    singlife = Singlife()
    return singlife

singlife = init_singlife_class()

@contextmanager
def st_capture(output_func):
    with StringIO() as stdout, redirect_stdout(stdout):
        old_write = stdout.write

        def new_write(string):
            ret = old_write(string)
            output_func(stdout.getvalue())
            return ret

        stdout.write = new_write
        yield

# Initialise session state variables
if 'generated' not in st.session_state:
    st.session_state['generated'] = []
if 'past' not in st.session_state:
    st.session_state['past'] = []

if 'model_name' not in st.session_state:
    st.session_state['model_name'] = []

if 'video_style' not in st.session_state:
    st.session_state['video_style'] = ""


# Sidebar - let user choose model, show total cost of current conversation, and let user clear the current conversation
st.sidebar.title("Sidebar")
model_name = st.sidebar.radio("Choose a model:", ("GPT-3.5", "GPT-4"))
# Text input for user to enter the style of video script generated
video_style = st.sidebar.text_input("Enter the style of video script you want to generate:", "Funny and sarcastic")
counter_placeholder = st.sidebar.empty()
clear_button = st.sidebar.button("Clear Conversation", key="clear")

# Map model names to OpenAI model IDs
if model_name == "GPT-3.5":
    model = "gpt-3.5-turbo-0613"
else:
    model = "gpt-4-0613"

# reset everything
if clear_button:
    st.session_state['generated'] = []
    st.session_state['number_tokens'] = []
    st.session_state['model_name'] = []


# container for chat history
response_container = st.container()
# container for text box
container = st.container()

with container:
    with st.form(key='my_form', clear_on_submit=True):
        user_input = st.text_area("You:", key='input', height=100,placeholder ="I am travelling to Japan for a ski trip with my family next week.What kind of travel insurance coverage do we need?")
        submit_button = st.form_submit_button(label='Send')

    if submit_button and user_input:

        with st.spinner(f"Running LLM on query: {user_input}"):
            # st.write(f'🧾 Logs')
            with st.expander(f"🧾 Logs"):
                output = st.empty()
                with st_capture(output.code):

                    # This is how to use the class
                    results = singlife.generateScript(query=user_input, model_name=model, video_style=video_style)
                    st.write(results)
                    st.write(f'Type of Results: {type(results)}')

        # Display the json output
        st.write(f'Results: {results}')
        st.write(f'Type of Results: {type(results)}')


        st.session_state['past'].append(user_input)
        st.session_state['generated'].append(results)
        st.session_state['model_name'].append(model_name)

        # from https://openai.com/pricing#language-models

if st.session_state['generated']:
    with response_container:
        for i in range(len(st.session_state['generated'])):
            message(st.session_state["past"][i], is_user=True, key=str(i) + '_user')
            message(st.session_state["generated"][i], key=str(i))
            st.write(
                f"Model used: {st.session_state['model_name'][i]};")
