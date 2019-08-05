using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using PDQ_Public.Models;

namespace PDQ_Public.Hubs
{
    public class ThoughtHub : Hub
    {
        /// <summary>
        /// Override when session is connected.
        /// </summary>
        /// <returns></returns>
        public override Task OnConnectedAsync()
        {
            Broadcast();
            return base.OnConnectedAsync();
        }
        /// <summary>
        /// Override when session is disconnected.
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(Exception ex)
        {
            return base.OnDisconnectedAsync(ex);
        }
        /// <summary>
        /// Broadcase the locked state to all connected clients.
        /// </summary>
        /// <param name="lockIt"></param>
        private void Broadcast(bool lockIt = false)
        {
            Clients.All.SendAsync("locked", lockIt);
        }
        /// <summary>
        /// Get the thought from the brain endpoint.
        /// </summary>
        public void GetThought()
        {
            LockApi(); //Lock api
            var thought = Brain.Stem.GetThought(); //Get thought
            thought.Photo = Brain.Stem.GetEmployeePhoto(thought?.Name); //Get employee photo
            Clients.All.SendAsync("thoughtResponse", thought); //Broadcase thought to clients
            UnlockApi(); //Unlock api
        }
        /// <summary>
        /// Triggers a locked state.
        /// </summary>
        public void LockApi()
        {
            Broadcast(true);
        }
        /// <summary>
        /// Triggers an unlocked state.
        /// </summary>
        public void UnlockApi()
        {
            Broadcast();
        }
    }
}
