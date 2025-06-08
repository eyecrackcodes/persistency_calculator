import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
   page_title="Demographic Persistency Calculator", 
   layout="wide",
   initial_sidebar_state="collapsed"
)

# Optional: Add a Streamlit header
st.title("🎯 Life Insurance Demographic Calculator")
st.markdown("**Optimize premium recommendations using ZIP code demographics and persistency data**")

# Load and display the HTML calculator
with open('demographic_calculator.html', 'r', encoding='utf-8') as f:
   html_content = f.read()

# Display the calculator
components.html(html_content, height=1000, scrolling=True)

# Optional: Add footer information
st.markdown("---")
st.markdown("**Data Sources:** Census income data, regional demographics, and actual persistency analysis")