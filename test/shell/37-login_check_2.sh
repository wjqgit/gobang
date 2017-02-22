#This is script#36
#check user login periodically (from 60s to 1s)
echo -e "Please Enter an username: \c"
read username

grep "$username" /etc/passwd > /dev/null 
if [ $? -eq 0 ]
then
	echo "Wait for it..."
else
	echo "User $username not found..."
	exit 1
fi

time=0

while true
do
	who | grep "$username" > /dev/null
	if [ $? -eq 0 ]
	then
		echo "$username has logged in."
		if [ $time -ne 0 ]
		then
			min=0
			sec=`expr $time % 60`
			if [ $time -gt 60 ]
			then
				min=`expr $time / 60`
			fi
			echo "$username was $min minutes $sec seconds late in logging in."
		fi
		exit	
	else
		time=`expr $time + 1`
		sleep 1
	fi
done

