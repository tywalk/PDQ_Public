using PDQ_Public.Client;
using System.Collections.Generic;

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
        /// <summary>
        /// Singleton instance of Brain.
        /// </summary>
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
        /// <summary>
        /// Retrieves thought from client.
        /// </summary>
        /// <returns></returns>
        public Thought GetThought()
        {
            lock (Mutex)
            {
                var client = new HubClient();
                return client.GetThought();
            }
        }
        /// <summary>
        /// Get and set employee photo srcs.
        /// </summary>
        private void SetSrcs()
        {
            var client = new HubClient();
            var srcs = client.GetPhotoSrcs();
            _srcs = srcs;
        }
        /// <summary>
        /// Returns photo src if exists.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public string GetEmployeePhoto(string name)
        {
            if (string.IsNullOrWhiteSpace(name) || !_srcs.ContainsKey(name)) return string.Empty;
            return _srcs[name];
        }
    }
}
