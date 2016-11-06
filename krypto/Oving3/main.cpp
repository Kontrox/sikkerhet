#include <iostream>
#include <math.h>

using namespace std;

int hash_func(int number) {
  int power_text = pow(number, 2);
  int counter;
  for(counter = 0; counter < power_text; counter++){
    int test = power_text/pow(10, counter);
    if(test <= 0) {
      break;
    }
  }
  int middle = counter/2;
  int power_table [counter];
  
  for(int i = 1; i <= counter; i++) {
    power_table[i-1] = power_text/pow(10, counter-i);
    int test = power_text/pow(10, counter-i+1);
    if(i-1 > 0) {
      power_table[i-1] -= test*10;
    }
  }
  int ciphered_text = 0;
  bool even = true;
  for(int i = 0; i < 3; i++) {
    if(even) {
      ciphered_text += power_table[middle - i/2] * pow(10, i); 
    } else {
      ciphered_text *= 10;
      ciphered_text += power_table[middle + (i/2) +1];
    }
    even = !even;
  }
  return ciphered_text;
}

int main() {
  int plaintext = 34932;
  int hash = hash_func(plaintext);
  int i;
  for(i = 0; i < 1000; i++) {
    if(hash_func(i) == hash) break;
  }
  cout << i << endl;
}