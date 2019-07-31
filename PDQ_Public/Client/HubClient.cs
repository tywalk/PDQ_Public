using Newtonsoft.Json;
using PDQ_Public.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PDQ_Public.Client
{
    public class HubClient : IDisposable
    {
        private readonly HttpClient _client;
        public HubClient()
        {
            _client = new HttpClient();
        }
        public void Dispose()
        {
            _client.Dispose();
        }

        public Thought GetThought()
        {
            var task = GetThoughtAsync();
            task.Wait();
            return task.Result;
        }

        private async Task<Thought> GetThoughtAsync()
        {
            var response = await _client.GetAsync("https://pdqweb.azurewebsites.net/api/brain");
            if (response.IsSuccessStatusCode)
            {
                var thought = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Thought>(thought);
            }
            return new Thought();
        }

        public Dictionary<string, string> GetPhotoSrcs()
        {
            return GetPhotoSrcsAsync().Result;
        }


        private Dictionary<string, string> FetchLinksFromSource(string htmlSource)
        {
            var links = new Dictionary<string, string>();
            var regexImgSrc = @"<img[^>]*?src\s*=\s*[""']?([^'"" >]+?)[ '""][^>]*?alt\s*=\s*[""']?([^'"" >]+?)[ '""][^>]*?>";
            var matchesImgSrc = Regex.Matches(htmlSource, regexImgSrc, RegexOptions.IgnoreCase | RegexOptions.Singleline);
            foreach (Match m in matchesImgSrc)
            {
                string href = m.Groups[1].Value;
                string name = m.Groups[2].Value;
                if (!links.ContainsKey(name))
                    links.Add(name, href);
            }
            return links;
        }

        private async Task<Dictionary<string, string>> GetPhotoSrcsAsync()
        {
            var response = await _client.GetAsync("https://www.pdq.com/about-us/");
            if (response.IsSuccessStatusCode)
            {
                var page = await response.Content.ReadAsStringAsync();
                return FetchLinksFromSource(page);
            }
            return new Dictionary<string, string>();
        }
    }
}
