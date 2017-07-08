// Stack - Reverse string
#include <iostream>
#include <stack> // stack from standard template library (STL)
#include <stdio.h>
#include <string.h>
using namespace std;

void Reverse(char C[]) {
// void Reverse(std::vector <char> C)
// {
    // int len = sizeof(C);
    int len = strlen(C);

    stack<char> S;
    
    for (int i = 0; i < len; i++)
    {
    std:
        cout << i << ": " << C[i] << std::endl;
        S.push(C[i]);
    }

    for (int i = 0; i < len; i++)
    {
        C[i] = S.top();
        S.pop();
    }
}

int main()
{
    char C[256];
    std::cout << "Enter a string: ";
    gets(C);
    // cin.getline(C, 256);
    // std::getline(std::cin, C);
    Reverse(C);
    std::cout << "Output: " << C << std::endl;
}