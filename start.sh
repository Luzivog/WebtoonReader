#!/bin/bash

# Open new terminal tab and run 'npm run start-api'
gnome-terminal --tab -- bash -c "npm run start-api; exec bash"

# Get the window ID of the current terminal
window_id=$(xdotool getactivewindow)
# xdotool windowactivate --sync $window_id key Ctrl+Page_Up

# Run 'npm run start-react' in current terminal
clear; npm run start-react