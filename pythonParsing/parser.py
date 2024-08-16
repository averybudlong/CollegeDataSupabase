from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv('../.env.local')

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

newColleges = [
  {"name": "University of Maryland", "undergradenrollment": 5000, "desc": "University located in Maryland with a population of 5000"},
  {"name": "University of Oregon", "undergradenrollment": 2000, "desc": "University located in Oregon with a population of 2000"},
  {"name": "Oregon State University", "undergradenrollment": 1000, "desc": "University located in Oregon with a population of 1000"},
  {"name": "Harvey Mudd", "undergradenrollment": 200, "desc": "University located in California with a population of 200"},
  {"name": "Harvard", "undergradenrollment": 100, "desc": "University located in Massachusetts with a population of 100"},
]

# for college in newColleges:
  

# print(newColleges)

def bulkCreate():
  try:
    response = supabase.table("college").insert(newColleges).execute()
    return response
  except Exception as exception:
    print(exception)
    return None
  
bulkCreate()

# get all data
# response = supabase.table("college").select("*").execute()
# for row in response.data:
#   print(row)