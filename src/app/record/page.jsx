import './record.css';

const PageRecord = async () => {
  return (
    <div className="pt-12">
        <button className='mic-toggle' id='micr'><span className="material-icons">mic</span></button>

        <audio className='playback' controls></audio>
    </div>
  );
};
export default PageRecord;
