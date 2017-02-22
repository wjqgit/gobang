#This is script#6: rename file to file.name, where name is the login name of the user executing the script
#Reverse Quotes / Accent Graves

name=$1
set `who am i`
mv $name $name.$1
