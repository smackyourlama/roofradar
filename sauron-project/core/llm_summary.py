import requests
import logging

class LLMSummarizer:
    def __init__(self, ollama_url="http://localhost:11434/api/generate", model="mistral"):
        self.ollama_url = ollama_url
        self.model = model
        
    def summarize_alert(self, alert_data):
        prompt = f"Summarize this cybersecurity alert in plain English and provide a severity assessment:\n{alert_data}"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(self.ollama_url, json=payload)
            response.raise_for_status()
            return response.json().get('response', 'No summary generated.')
        except Exception as e:
            logging.error(f"Failed to generate summary: {e}")
            return "Error generating summary."

if __name__ == "__main__":
    summarizer = LLMSummarizer()
    # print(summarizer.summarize_alert("Suspicious SSH login attempts detected from 192.168.1.50"))
