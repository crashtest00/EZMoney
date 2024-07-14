#!/bin/bash
echo "Gathering your ip for hosting metro from within the dev container..."

# moves to the directory of the initialize command, allowing it to be run from anywhere
cd $( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# grabs the first in-use IP address. If this isn't working, check to see if the IP you 
# want to use is the first one listed in :
#     $ hostname -i
# if it's note, simply replace the '1' in 'NR==1' to reflect your IP's position in the
# output of the 'hostname' command.
ip=$(hostname -i | tr ' ' '\n' | awk 'NR==1')

echo "REACT_NATIVE_PACKAGER_HOSTNAME=$ip" > $dir/.env
