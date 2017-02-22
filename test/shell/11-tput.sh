#This is script#11
#tput
tput clear
echo -e "Total # of rows on screen=\c"
tput lines
echo -e "Total # of columns on screen=\c"
tput cols
tput cup 7 13
tput bold
echo "This is a bold message."
echo -e "\033[0mThis is a normal message."


