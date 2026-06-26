import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Look inside the folder and load the .env file into memory
load_dotenv()

# Securely grab the strings from memory
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# Safety tripwire
if not url or not key:
    raise ValueError("CRITICAL: Supabase credentials missing in .env file")

# Open the connection to the database
supabase: Client = create_client(url, key)