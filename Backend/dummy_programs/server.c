#include <unistd.h>
#include <signal.h>
#include <stdio.h>

void signal_handler(int sig)
{
	if(sig == SIGUSR1)
		write(1,"signal one has been received\n",29);
	if(sig == SIGUSR2)
		write(1,"signal two has been received\n",29);	
}

int main(void)
{
	pid_t pid;

	signal(SIGUSR1, signal_handler);
    signal(SIGUSR2, signal_handler);

	pid = getpid();
	printf("%d\n",pid);
	while (1)
	{
		sleep(1);
	}
	
}