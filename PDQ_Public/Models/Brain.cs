using PDQ_Public.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PDQ_Public.Models
{
    public class Brain
    {
        private static Brain _brainInstance;
        private static readonly object Mutex = new object();
        private static Dictionary<string, string> _srcs = new Dictionary<string, string>();
        private Brain()
        {
            SetSrcs();
        }

        public static Brain Stem
        {
            get
            {
                if (_brainInstance == null)
                {
                    lock (Mutex)
                    {
                        if (_brainInstance == null)
                        {
                            _brainInstance = new Brain();
                        }
                    }
                }
                return _brainInstance;
            }
        }

        public Thought GetThought()
        {
            lock (Mutex)
            {
                var client = new HubClient();
                return client.GetThought();
            }
        }

        private void SetSrcs()
        {
            var client = new HubClient();
            var srcs = client.GetPhotoSrcs();
            _srcs = srcs;
        }

        public string GetEmployeePhoto(string name)
        {
            if (string.IsNullOrWhiteSpace(name) || !_srcs.ContainsKey(name)) return string.Empty;
            return _srcs[name];
        }
    }
}
