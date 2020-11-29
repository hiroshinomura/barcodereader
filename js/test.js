var totalAmount = 0;
var currentCode = "";
function sound()
{
	// �ΏۂƂȂ�ID��
	var id = 'welcome-file' ;

	// ����ȊO�������特���t�@�C���������߂�
	if( typeof( document.getElementById( id ).currentTime ) != 'undefined' )
	{
		document.getElementById( id ).currentTime = 0;
	}

	// [ID:sound-file]�̉����t�@�C�����Đ�[play()]����
	document.getElementById( id ).play() ;


}
function payment()
{
	var str = "The total is "+totalAmount.toString(10)+" yen.";
	const uttr = new SpeechSynthesisUtterance(str)
	uttr.pitch = 1.5
	uttr.lang = "en-US";
	// �������Đ� (�����L���[�ɔ�����ǉ�)
	speechSynthesis.speak(uttr)

}
function zero()
{
	totalAmount = 0;
	document.getElementById('total').innerHTML = totalAmount ;
}

function plus()
{
	var str = "An item is manually added.";
	const uttr = new SpeechSynthesisUtterance(str);
	uttr.pitch = 1.5;
	uttr.lang = "en-US";
	// �������Đ� (�����L���[�ɔ�����ǉ�)
	speechSynthesis.speak(uttr);

	totalAmount = totalAmount + 100;
	document.getElementById('total').innerHTML = totalAmount ;
}

function bye()
{
	var str = "Thank you for coming to Nomura bookstore. I really appreciate your buying many books. See you next time. Bye!";
	const uttr = new SpeechSynthesisUtterance(str);
	uttr.pitch = 1.5;
	uttr.lang = "en-US";
	// �������Đ� (�����L���[�ɔ�����ǉ�)
	speechSynthesis.speak(uttr);
}

// �r�W�[wait���g�����@
function sleep(waitMsec) {
  var startMsec = new Date();
 
  // �w��~���b�Ԃ������[�v������iCPU�͏�Ƀr�W�[��ԁj
  while (new Date() - startMsec < waitMsec);
}

$(function () {

    startScanner();

});

const startScanner = () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#photo-area'),
	    constraints: { facingMode: "environment" }
        },
        decoder: {
            readers: [
                "ean_reader", "ean_8_reader"
            ]
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "green",
                        lineWidth: 2
                    });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {
                    x: 'x',
                    y: 'y'
                }, drawingCtx, {
                    color: 'red',
                    lineWidth: 3
                });
            }
        }
    });

    //barcode read call back
    Quagga.onDetected(function (result) {
	var code = result.codeResult.code;
	if (currentCode != code && code.length==13){
	        document.getElementById( 'sound-file' ).play() ;
		totalAmount=totalAmount+100;
		var str = "100";
	        //document.getElementById('total').innerHTML = str ;
		document.getElementById('total').innerHTML = totalAmount ;
		document.getElementById('code').innerHTML = result.codeResult.code ;
	        console.log(result.codeResult.code);
		currentCode = code;
		Quagga.stop();
		sleep(1000);
		Quagga.start()
	}
    });
}