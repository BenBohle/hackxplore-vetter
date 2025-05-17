#include <unistd.h>
#include <stdlib.h>
int main(void)
{
	sleep(6);
	write(2,"Error: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet blandit mi. Vivamus at urna odio. Pellentesque tincidunt luctus lorem non fermentum. Nunc finibus ultricies eros quis semper. Morbi fermentum a odio eget lacinia. Praesent vitae lacinia libero, egestas mollis dui. Integer vehicula quam vel mauris tempus mattis. Curabitur.\n",350);
	exit(42);
}