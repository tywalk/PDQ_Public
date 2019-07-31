using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using PDQ_Public.Models;

namespace PDQ_Public.Hubs
{
    public class ThoughtHub : Hub
    {

        public override Task OnConnectedAsync()
        {
            Broadcast();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception ex)
        {
            //Broadcast(); // not sure if this is necessary

            return base.OnDisconnectedAsync(ex);
        }

        private void Broadcast(bool lockIt = false)
        {
            Clients.All.SendAsync("locked", lockIt);
        }

        public void GetThought()
        {
            LockApi();
            var thought = Brain.Stem.GetThought();
            thought.Photo = Brain.Stem.GetEmployeePhoto(thought?.Name);
            Clients.All.SendAsync("thoughtResponse", thought);
            UnlockApi();
        }

        public void LockApi()
        {
            Broadcast(true);
        }

        public void UnlockApi()
        {
            Broadcast();
        }
    }
}
