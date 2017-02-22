#This is script#17

str1="Mia"
str2="Marley"
str3=
#str3=""

[ "$str1" = "$str2" ]
echo $?

[ "$str1" != "$str2" ]
echo $?

#Length is not zero
[ -n "$str1" ]
echo $?

#Length is zero
[ -z "$str3" ]
echo $?
